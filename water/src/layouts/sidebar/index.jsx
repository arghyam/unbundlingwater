import { motion } from "framer-motion";
import { useState } from "react";
import App from "../../App"; 
import { BrowserRouter, NavLink } from "react-router-dom";
import ReactDOM from"react-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { PiFilesDuotone } from "react-icons/pi";
import { GrContact } from "react-icons/gr";
import { MdPermDeviceInformation } from "react-icons/md";

ReactDOM.render(
  <BrowserRouter>
  <App/>
  </BrowserRouter>,
  document.getElementById('root')
)

const Sidebar = () => {
  const Sidebar_animation = {
    open: {
      // x: 0,
      width: "16rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      // x: -250,
      width: "4rem",
      transition: {
        damping: 40,
        //   delay: 0.15,
      },
    },
  };
  const [isOpen, setOpen] = useState(true);

  return (
    <div>
      <motion.div
        variants={Sidebar_animation}
        animate={isOpen ? "open" : "closed"}
        className=" bg-white text-gray shadow-xl z-[999] max-w-[16rem]  w-[16rem] 
            overflow-hidden md:relative fixed
         h-screen "
      >
        <div className="flex items-center gap-2.5 font-medium border-b py-3 border-slate-300  mx-3">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPsAAADJCAMAAADSHrQyAAAAnFBMVEX/yij/////oAD/zjz/0En/ySP/zkf/nQD/xST/pyT/zT7/mAD/qjb/xwD/zSr/mgD/5sn/7cP/shb/xQD/6LH/4L//0lr/yBf/2HT/6bb/9d7/7sj/+u7/35D/46D/12//69b/16v/xYP/uGD/rkP/z5n/0Z7/u2r/2bH/sUz/qzr/pQn/uBv/vh//4Jf/9+b/02H/sjn/uz7/w0Hd3b5zAAADO0lEQVR4nO3ZaXPaMBSF4avGilOImkKMZcCGLE2XELr+//9WmSVhS6czQZbwOe/HfMjcZ65kwyBqv5vbu/tPl+/f1OzjgX8cWbL7h8F99ypN03dvrRs/fsf+kF69nX0q+C377RH2fUL4DXt5eXVE+QngX+yD7jGXfgr4Z/tD99jy6PFr+50PeuT4ld3L1mPHL+0DX/So8Qt76Y8eM35hfzz6E/4k8LX99sjv9VPB13avW48Y7+yfPa89Wryze5fHihc18L/2SPGivni/7rHiRTWy9ijxcuPzc03cePnazJGPES93zdljw0tDj7oY8fKtQXpkeHk8NGLqrZjwcrnvnvWf5he+uk7Omy4vvg9//Ic9nc3lwwfxmG4+a63R1ejf9rR/4dUdMmvOhq/b0760Vl6njfRes89bLa/T5md5wJ7OQg/WSNaO9+xpv/VLX3Wd7djTJxS6iJls2XG2XmeyTfsMie6O/XjDHnqYpjPl2p5ehJ6l6XS+tkNd9mWmt7SnoQcJkNYLO9Yzfp3NFvbQYwRJS20He7+tM2Nnn4eeIky2cHYdeopAGSW/MI+8s4/kd+gZQmWH8if0DKGylZyHniFUupBz1GedzqUTeoZQ6QTX7uS0I0Y7ZrRjRjtmtGNGO2a0Y0Y7ZrRjRjtmtGNGO2Yd3N/jnDyB/T0uoR0x2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jGjHTPaMaMdM9oxox0z2jFz9hzWnksBay+ksqGHCJStZAhrH8rIhB4iUGYkCtauRBWYh94Wzj7GXLwZO7vSiG85rVVtnyAeejtZ2BWkXS3tGd6NN9nKruC+z+hEre0l2uJN+WxXvevQ0zSa6akXu5ogbd5M1KZdVTh4U6ltO87m11vfsKueQXja69Vd37arMmn/6k1SqkN29yHHtvsjnrXZJnfL7m69bu3J18ZOtrE7dnftp8ZY26rvdlpba8y0t0vds7tGWTXNO2dtqZNPq2x0wPkXknZT2oyFVVoAAAAASUVORK5CYII="
            width={45}
            alt=""
          />
          <span className="text-xl whitespace-pre"> Assets</span>
        </div>
          
        {/* Menus */}
        <div className="flex flex-col  h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden ">
            <li>
              <NavLink to={"/"} className="link">
              <IoHome  size={23} className="min-w-max" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/about"} className="link">
                <MdPermDeviceInformation size={23} className="min-w-max" />
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to={"/people"} className="link">
                <BsPerson size={23} className="min-w-max" />
                People Assets
              </NavLink>
            </li>
            <li>
              <NavLink to={"/content"} className="link">
                <PiFilesDuotone size={23} className="min-w-max" />
                Content Assets
              </NavLink>
            </li>
            <li>
              <NavLink to={"/contact"} className="link">
                < GrContact size={23} className="min-w-max" />
                Contact Us
              </NavLink>
            </li>

            {/* Submenu */}
            
            </ul>
            </div>

        <motion.div
          animate={
            isOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -200,
                  rotate: 180,
                }
          }
          transition={{ duration: 0 }}
          onClick={() => {
            setOpen(!isOpen);
          }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
