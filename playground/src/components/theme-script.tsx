export function ThemeScript() {
  const code = `
    (function () {
      try {
        var appearance = localStorage.getItem("conscia-appearance") || "system";
        var density = localStorage.getItem("conscia-density") || "comfortable";
        var dark = appearance === "dark" || (appearance === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.dataset.appearance = appearance;
        document.documentElement.dataset.density = density;
        document.documentElement.classList.toggle("dark", dark);
      } catch (error) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
