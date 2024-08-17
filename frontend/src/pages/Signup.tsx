import Quote from "../components/Quote";
import Auth from "../components/Auth";
export default function Signup() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <Auth type={"Signup"} />
        </div>
        <div className="hidden lg:block">
          <Quote />
        </div>
      </div>
    </div>
  );
}
