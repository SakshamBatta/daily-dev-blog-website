import { Avatar } from "./BlogCard";

export default function Appbar() {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <div>Daily-Dev</div>
      <div>
        <Avatar name="Dev" />
      </div>
    </div>
  );
}
