import FileBrowserNotFound from "@/components/FileBrowser/FileBrowserNotFound";
import { Shell } from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell activePage="browser.not-found">
      <FileBrowserNotFound />
    </Shell>
  );
}
