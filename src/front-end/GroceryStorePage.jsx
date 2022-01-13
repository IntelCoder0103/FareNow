import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Paginate from "../components/Paginate";
import { addToCart, getCartList } from "../store/Slices/cart/cartsSlice";
import {
    getGroceryStore,
    getProducts,
} from "../store/Slices/grocery/groceryStoreSlice";
import Rating from "./../components/Rating";
import { ProductCard } from "./common/Cards";
import { Cart } from "./common/Cart";
export const GroceryStorePage = (props) => {
    const { match, location } = props;
    const dispatch = useDispatch();
    const loading = useRef(null);

    useEffect(() => {
        if (match?.params?.id) {
            if (match?.params?.id) {
                dispatch(getGroceryStore(match.params.id));
                dispatch(getProducts({ id: match.params.id }));
                dispatch(getCartList());
            }
        }
    }, [match?.params?.id]);

    const groceryStore = useSelector(
        (state) => state.groceryStoreReducer?.groceryStore
    );

    const products = useSelector(
        (state) => state.groceryStoreReducer?.products
    );

    const productsMeta = useSelector(
        (state) => state.groceryStoreReducer?.products?.meta
    );

    const cartList = useSelector((state) => state.cartsReducer?.list);

    const cart = useSelector((state) => state.cartsReducer?.cart);

    useEffect(() => {
        if (cart?.error == false && cart?.data) {
            toast.dismiss(loading.current);
            toast.success(cart?.message || "Added to cart");
        }
        if (cart?.error && cart?.loading == false) {
            toast.dismiss(loading.current);
            toast.error(cart?.message || "Something went wrong");
        }
    }, [cart]);

    const handleAddToCart = (id) => {
        toast.dismiss(loading.current);
        loading.current = toast.info("Adding to cart", {
            autoClose: false,
        });
        dispatch(addToCart({ product_id: id, quantity: 1 }));
    };

    return (
        <div className="container-fluid restaurant-page">
            <div className="row">
                <div
                    className="col-md-9 "
                    style={{
                        paddingRight: "0px",
                    }}
                >
                    <div className="row">
                        <div className="col-md-12">
                            <img
                                src={
                                    groceryStore?.data?.cover_image ||
                                    "/assets/img/restaurant.jpg"
                                }
                                className="restaurant-banner"
                            ></img>
                            <div className="col-md-12">
                                <div className="row d-flex align-items-center">
                                    <div className="col-md-8  restaurant-name">
                                        {groceryStore?.data?.name}
                                    </div>
                                    <div className="col-md-4 restaurant-rating d-flex justify-content-end">
                                        <Rating rating={3}></Rating>
                                    </div>
                                    <div className="col-md-12 restaurant-address">
                                        {groceryStore?.data?.address}
                                    </div>
                                    <div className="col-md-12 restaurant-category">
                                        {groceryStore?.data?.about}
                                    </div>
                                </div>
                                <div className="col-md-12 ">
                                    <div className="row mt-4">
                                        {products?.data?.map((food, index) => {
                                            const {
                                                id,
                                                name,
                                                description,
                                                price,
                                                rating,
                                                image,
                                            } = food;
                                            return (
                                                <div
                                                    className="col-md-6 mb-4"
                                                    key={index}
                                                >
                                                    <ProductCard
                                                        {...{
                                                            id,
                                                            title: name,
                                                            description,
                                                            price: `$${price}`,
                                                            rating,
                                                            image,
                                                            link: `/product-detail/${id}?type=GROCERY`,
                                                            handleAddToCart:
                                                                () =>
                                                                    handleAddToCart(
                                                                        id
                                                                    ),
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-5">
                            {(() => {
                                let data = {
                                    current_page: 0,
                                    total: 0,
                                };
                                if (match?.params?.id) {
                                    data.id = match?.params?.id;
                                    data.last_page = productsMeta?.last_page;
                                    data.current_page =
                                        productsMeta?.current_page;
                                    data.func = getProducts;
                                    return <Paginate {...data} />;
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <Cart data={cartList}></Cart>
                </div>
            </div>
        </div>
    );
};