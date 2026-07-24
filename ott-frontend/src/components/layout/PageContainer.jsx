export function PageContainer({ as: Component = "div", className = "", children }) {
  return (
    <Component className={["content-container", className].join(" ")}>
      {children}
    </Component>
  );
}
