import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../services/api";
import {
  useAuth
} from "./AuthContextValue";
import {
  WishlistContext
} from "./WishlistContextValue";

function WishlistProvider({
  children
}) {
  const {
    user
  } = useAuth();

  const [
    wishlist,
    setWishlist
  ] = useState({
    user: null,
    productIds: []
  });

  useEffect(() => {
    let active = true;

    if (!user) {
      return () => {
        active = false;
      };
    }

    let productIds = [];

    api
      .get("/wishlist")
      .then((response) => {
        productIds =
          (response.data.products || [])
            .map((product) =>
              typeof product === "string"
                ? product
                : product._id
            );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (active) {
          setWishlist({
            user,
            productIds
          });
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  const isCurrentUserWishlist =
    wishlist.user === user;
  const productIds = useMemo(
    () =>
      isCurrentUserWishlist
        ? wishlist.productIds
        : [],
    [
      isCurrentUserWishlist,
      wishlist.productIds
    ]
  );
  const loading =
    Boolean(user) &&
    !isCurrentUserWishlist;

  const addProduct = useCallback(
    async (productId) => {
      if (productIds.includes(productId)) {
        return;
      }

      const response = await api.post(
        `/wishlist/${productId}`
      );

      setWishlist({
        user,
        productIds:
          (response.data.products || []).map(
            (product) =>
              typeof product === "string"
                ? product
                : product._id
          )
      });
    },
    [productIds, user]
  );

  const removeProduct = useCallback(
    async (productId) => {
      const response = await api.delete(
        `/wishlist/${productId}`
      );
      const products =
        response.data.products || [];

      setWishlist({
        user,
        productIds: products.map((product) =>
          typeof product === "string"
            ? product
            : product._id
        )
      });

      return products;
    },
    [user]
  );

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        loading,
        addProduct,
        removeProduct
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
