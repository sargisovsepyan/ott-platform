import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  MEMBERSHIP_SECTION_ID,
  createSectionScrollState,
  scrollToMembershipSection,
} from "../utils/scrollNavigation";

function isModifiedClick(event) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

export function usePlansNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (event) => {
      if (isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      if (location.pathname === "/") {
        if (location.search || location.hash !== `#${MEMBERSHIP_SECTION_ID}`) {
          navigate(
            { pathname: "/", hash: `#${MEMBERSHIP_SECTION_ID}` },
            { state: createSectionScrollState(MEMBERSHIP_SECTION_ID) },
          );
        }

        window.requestAnimationFrame(scrollToMembershipSection);
        return;
      }

      navigate(`/#${MEMBERSHIP_SECTION_ID}`, {
        state: createSectionScrollState(MEMBERSHIP_SECTION_ID),
      });
    },
    [location.hash, location.pathname, location.search, navigate],
  );
}
