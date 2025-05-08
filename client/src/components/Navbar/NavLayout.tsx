import NavBar from "./NavBar";
import AnimatedOutlet from "../Animations/AnimatedOutlet";

function NavLayout() {
  return (
    <div>
      <NavBar />
      <div>
        <AnimatedOutlet />
      </div>
    </div>
  );
}

export default NavLayout;
