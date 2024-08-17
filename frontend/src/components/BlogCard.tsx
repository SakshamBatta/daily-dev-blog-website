interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export default function BlogCard({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) {
  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex ">
        <Avatar name={authorName} />

        <div className="font-extralight pl-2 flex justify-center flex-col text-sm">
          {authorName}
        </div>
        <div className="flex justify-center flex-col pl-2 mt-1">
          <Circle />
        </div>
        <div className="pl-2 font-thin text-slate-500 flex justify-center flex-col text-sm">
          {publishedDate}
        </div>
      </div>

      <div className="text-xl font-semibold pt-2">{title}</div>
      <div className="text-md font-thin">
        {content.length > 100 ? content.slice(0, 100) + "...." : content}
      </div>
      <div className="text-slate-500 text-sm font-thin pt-2">{`${Math.ceil(
        content.length / 100
      )} minute(s) read`}</div>
    </div>
  );
}

function Circle() {
  return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({ name }: { name: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="text-xs font-extralight text-gray-600 dark:text-gray-300 ">
        {name[0]}
      </span>
    </div>
  );
}
