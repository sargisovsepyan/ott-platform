import { Clapperboard, Compass, Sparkles } from "lucide-react";
import { PageContainer } from "./PageContainer";

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}) {
  return (
    <PageContainer className="flex min-h-[calc(100svh-7.5rem)] items-center py-8 sm:py-12 lg:min-h-[calc(100svh-9rem)]">
      <div className="panel-surface grid w-full overflow-hidden rounded-lg lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]">
        <aside className="auth-visual relative hidden min-h-[39rem] overflow-hidden border-r border-border/80 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-text">
              <span className="grid size-9 place-items-center rounded-md border border-primary/55 bg-primary-soft text-primary-hover">
                <Clapperboard className="size-4.5" aria-hidden="true" />
              </span>
              LUMIO
            </p>
          </div>
          <div className="auth-frame-stage" aria-hidden="true">
            <div className="auth-frame auth-frame-left">
              <Compass className="size-7" />
            </div>
            <div className="auth-frame auth-frame-center">
              <span>L</span>
            </div>
            <div className="auth-frame auth-frame-right">
              <Sparkles className="size-7" />
            </div>
          </div>
          <div className="relative z-10 max-w-lg">
            <p className="page-eyebrow">Your next discovery</p>
            <p className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em]">
              Cinema, thoughtfully curated.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
              Explore a focused catalogue shaped around strong stories and memorable
              frames.
            </p>
          </div>
        </aside>
        <section className="flex min-w-0 items-center bg-background-elevated/70 px-5 py-9 sm:px-9 sm:py-12 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-md">
            <p className="page-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-text-muted">{description}</p>
            {children}
            {footer ? <div className="mt-7">{footer}</div> : null}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
