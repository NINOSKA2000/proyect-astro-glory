import { useEffect, useState } from "react";
import Card from "../Card";
import "./card-list.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useResponsive from "../../hooks/useResponsive";
import { useStore } from "@nanostores/react";
import { activeDreamUpCard } from "../../store/form";
import { navigate } from "astro:transitions/client";

const CardList = ({ cards, login = false }) => {
  const $activeDreamUpCard = useStore(activeDreamUpCard);

  useEffect(() => {
    if (login) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    }
  }, []);

  const isDesktop = useResponsive();

  function setCustomActiveCard(id) {
    activeDreamUpCard.set(id);
  }

  function renderCard({ type, name, form, id, ...props }) {
    return (
      <Card
        client:visible
        key={id + name}
        type={type}
        form={form}
        login={login}
        name={name}
        active={$activeDreamUpCard ? $activeDreamUpCard === id : false}
        disabled={$activeDreamUpCard && $activeDreamUpCard !== id}
        onClick={(id) => setCustomActiveCard(id)}
        id={id}
        {...props}
      />
    );
  }

  return (
    <>
      {isDesktop ? (
        <div className="cmp-card-list">
          {cards.map((card) => renderCard(card))}
        </div>
      ) : (
        <div>
          <Swiper
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index}>{renderCard(card)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default CardList;
