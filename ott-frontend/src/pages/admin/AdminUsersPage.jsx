import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, UsersRound } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  deleteAdminUser,
  fetchAdminUsers,
} from "../../api/adminUsersApi";
import { Alert } from "../../components/feedback/Alert";
import { ConfirmDialog } from "../../components/feedback/ConfirmDialog";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Skeleton } from "../../components/feedback/Skeleton";
import { PageContainer } from "../../components/layout/PageContainer";
import { Pagination } from "../../components/movies/Pagination";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useAuth } from "../../hooks/useAuth";

const USERS_PER_PAGE = 10;
const validRoles = new Set(["user", "admin"]);

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
}

function getRequestMessage(error) {
  const details = Array.isArray(error?.errors)
    ? error.errors
        .map((item) =>
          typeof item === "string" ? item : item?.message,
        )
        .filter(Boolean)
    : [];

  return details.length
    ? `${error.message} ${details.join(" ")}`
    : error?.message || "The request could not be completed.";
}

function RoleBadge({ role }) {
  return (
    <Badge tone={role === "admin" ? "primary" : "neutral"}>
      {role === "admin" ? "Administrator" : "User"}
    </Badge>
  );
}

function DeleteUserButton({ user, isCurrentUser, onDelete, fullWidth = false }) {
  return (
    <Button
      variant="danger"
      className={fullWidth ? "w-full" : ""}
      disabled={isCurrentUser}
      onClick={() => onDelete(user)}
      title={isCurrentUser ? "You cannot delete your current account." : undefined}
    >
      <Trash2 className="size-4" aria-hidden="true" />
      {isCurrentUser ? "Current account" : "Delete"}
    </Button>
  );
}

function UserSearch({ initialValue, onSubmit }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-primary-hover"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by name or email"
          aria-label="Search users by name or email"
          className="pl-10"
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        className="w-full shrink-0 sm:w-auto"
      >
        Search
      </Button>
    </form>
  );
}

export function AdminUsersPage() {
  const {
    user: currentUser,
    token,
    isAdmin,
    isInitializing,
  } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const requestedRole = searchParams.get("role")?.trim() ?? "";
  const role = validRoles.has(requestedRole) ? requestedRole : "";
  const pageValue = Number(searchParams.get("page"));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [requestKey, setRequestKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    queryKey: "",
    users: [],
    total: 0,
    totalPages: 0,
    error: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const queryKey = [search, role, page, requestKey].join("|");
  const displayStatus = state.queryKey === queryKey ? state.status : "loading";
  const hasActiveFilters = Boolean(search || role);

  const retry = useCallback(() => setRequestKey((value) => value + 1), []);

  const setQuery = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    if (isInitializing || !isAdmin || !token) {
      return undefined;
    }

    const controller = new AbortController();

    fetchAdminUsers(
      {
        page,
        limit: USERS_PER_PAGE,
        search,
        role,
      },
      { signal: controller.signal },
    )
      .then((data) => {
        if (data.pagination.pages > 0 && page > data.pagination.pages) {
          setQuery({ page: data.pagination.pages });
          return;
        }
        if (data.pagination.pages === 0 && page > 1) {
          setQuery({ page: 1 });
          return;
        }

        setState({
          status: "success",
          queryKey,
          users: data.users,
          total: data.pagination.total,
          totalPages: data.pagination.pages,
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState((current) => ({
            ...current,
            status: "error",
            queryKey,
            error: getRequestMessage(error),
          }));
        }
      });

    return () => controller.abort();
  }, [
    isAdmin,
    isInitializing,
    page,
    queryKey,
    role,
    search,
    setQuery,
    token,
  ]);

  const openDeleteDialog = (user) => {
    setDeleteError("");
    setSuccessMessage("");
    setSelectedUser(user);
  };

  const handleDelete = async () => {
    if (
      !selectedUser ||
      selectedUser.id === currentUser?.id ||
      isDeleting
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const result = await deleteAdminUser(selectedUser.id);
      const deletedName = selectedUser.name || selectedUser.email;
      setSelectedUser(null);
      setSuccessMessage(
        result.message || `${deletedName} was deleted successfully.`,
      );

      if (state.users.length === 1 && page > 1) {
        setQuery({ page: page - 1 });
      } else {
        retry();
      }
    } catch (error) {
      setDeleteError(getRequestMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer className="page-section">
      <header className="admin-intro rounded-lg px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <p className="page-eyebrow">Lumio administration</p>
        <h1 className="mt-3 break-words text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          User management
        </h1>
        <p className="mt-4 max-w-2xl text-text-muted">
          View and manage registered Lumio users.
        </p>
        <p className="mt-3 text-sm font-medium text-text-muted" aria-live="polite">
          {displayStatus === "success"
            ? `${state.total} matching ${state.total === 1 ? "user" : "users"}`
            : "Loading users"}
        </p>
      </header>

      {successMessage ? (
        <Alert tone="success" className="mt-6">
          {successMessage}
        </Alert>
      ) : null}

      <section
        className="panel-surface mt-8 grid gap-4 rounded-lg p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end"
        aria-label="User filters"
      >
        <UserSearch
          key={search}
          initialValue={search}
          onSubmit={(value) => setQuery({ search: value, page: 1 })}
        />
        <label className="grid gap-2 text-sm font-semibold">
          Role
          <Select
            value={role}
            onChange={(event) =>
              setQuery({ role: event.target.value, page: 1 })
            }
          >
            <option value="">All roles</option>
            <option value="user">Users</option>
            <option value="admin">Administrators</option>
          </Select>
        </label>
      </section>

      <div className="mt-6">
        {displayStatus === "loading" ? (
          <div className="grid gap-3" aria-label="Loading users">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
        ) : null}

        {displayStatus === "error" ? (
          <ErrorState
            title="User management could not load"
            message={state.error}
            onRetry={retry}
          />
        ) : null}

        {displayStatus === "success" && !state.users.length ? (
          <EmptyState
            title={hasActiveFilters ? "No users match" : "No registered users"}
            message={
              hasActiveFilters
                ? "Try changing or clearing the current search and role filter."
                : "Registered users will appear here."
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />
        ) : null}

        {displayStatus === "success" && state.users.length ? (
          <>
            <div className="panel-surface hidden overflow-x-auto rounded-lg lg:block">
              <table className="w-full min-w-[64rem] border-collapse text-left">
                <thead className="bg-background-elevated/90 text-xs uppercase tracking-[0.08em] text-text-subtle">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Registered</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.users.map((user) => {
                    const isCurrentUser = user.id === currentUser?.id;

                    return (
                      <tr
                        key={user.id}
                        className="border-t border-border/75 transition-colors duration-[140ms] ease-out hover:bg-surface-hover/55"
                      >
                        <td className="max-w-56 px-4 py-3">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <span className="break-words font-semibold [overflow-wrap:anywhere]">
                              {user.name || "Unnamed user"}
                            </span>
                            {isCurrentUser ? (
                              <Badge tone="success">You</Badge>
                            ) : null}
                          </div>
                        </td>
                        <td className="max-w-72 px-4 py-3 text-sm text-text-muted">
                          <span className="break-words [overflow-wrap:anywhere]">
                            {user.email}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-text-subtle">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-text-subtle">
                          {formatDate(user.updatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <DeleteUserButton
                            user={user}
                            isCurrentUser={isCurrentUser}
                            onDelete={openDeleteDialog}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {state.users.map((user) => {
                const isCurrentUser = user.id === currentUser?.id;

                return (
                  <article
                    key={user.id}
                    className="panel-surface min-w-0 rounded-lg p-4 sm:p-5"
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <UsersRound
                        className="size-5 shrink-0 text-primary-hover"
                        aria-hidden="true"
                      />
                      <h2 className="min-w-0 break-words text-lg font-semibold [overflow-wrap:anywhere]">
                        {user.name || "Unnamed user"}
                      </h2>
                      {isCurrentUser ? (
                        <Badge tone="success">You</Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 break-words text-sm text-text-muted [overflow-wrap:anywhere]">
                      {user.email}
                    </p>
                    <div className="mt-4">
                      <RoleBadge role={user.role} />
                    </div>
                    <dl className="mt-5 grid gap-3 border-y border-border/70 py-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-text-subtle">Registered</dt>
                        <dd className="mt-1 font-medium text-text">
                          {formatDate(user.createdAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-subtle">Updated</dt>
                        <dd className="mt-1 font-medium text-text">
                          {formatDate(user.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-5">
                      <DeleteUserButton
                        user={user}
                        isCurrentUser={isCurrentUser}
                        onDelete={openDeleteDialog}
                        fullWidth
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : null}
      </div>

      {displayStatus === "success" ? (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={state.totalPages}
            onPageChange={(nextPage) => setQuery({ page: nextPage })}
          />
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(selectedUser)}
        title="Delete user?"
        message={
          selectedUser
            ? `Delete “${selectedUser.name || "Unnamed user"}” (${selectedUser.email})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete user"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) {
            setSelectedUser(null);
            setDeleteError("");
          }
        }}
      />
    </PageContainer>
  );
}
