import {
  useEffect,
  useRef
} from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPathname = useRef(null);

  useEffect(() => {
    const previousScrollRestoration =
      window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration =
        previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (location.state?.scrollToProducts) {
      const target = document.getElementById("shop-products");
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      navigate(
        `${location.pathname}${location.search}${location.hash}`,
        {
          replace: true,
          state: null
        }
      );
    } else if (previousPathname.current !== location.pathname) {
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }

    previousPathname.current = location.pathname;
  }, [location, navigate]);

  return null;
}

export default ScrollToTop;