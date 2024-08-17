import Auth from "../components/Auth";
import Quote from "../components/Quote";

export default function Signin() {
  return (
    <div>
      <div className="grid grid-cols-2">
        <div>
          <Auth type={"Signin"} />
        </div>
        <div className="invisible lg:visible">
          <Quote />
        </div>
      </div>
    </div>
  );
}
