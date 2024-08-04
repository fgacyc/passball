/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef } from "react";
import type {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { type Participant } from "@/data/players";
import { useFirestore } from "reactfire";
import { doc, increment, updateDoc } from "firebase/firestore";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type PropType = {
  slides: Participant[];
  options?: EmblaOptionsType;
  gender: "male" | "female";
  setAnswered: (gender: "male" | "female", state: boolean) => void;
  setChoice: (gender: "male" | "female", selection: string) => void;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, gender, setAnswered, setChoice } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number")!;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap?.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode!.style.transform = `scale(${scale})`;
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, setTweenFactor, setTweenNodes, tweenScale]);

  const firestore = useFirestore();

  const incrementCounter = async (key: string) => {
    await updateDoc(doc(firestore, "passball", gender), {
      [key]: increment(1),
    });
    setChoice(gender, key);
    setAnswered(gender, true);
  };

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index.name}>
              <div className="embla__slide__number">
                <div className="relative w-full">
                  <div className="absolute bottom-0 left-1/2 z-10 h-[250px] w-[250px] -translate-x-1/2 border-[3px] border-white" />
                  <img
                    src={`/assets/${gender}/${index.img}.png`}
                    className="relative z-20 mb-[2px] object-contain"
                  />
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-white">
                  🏀 {index.name}
                </p>
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                <button
                  onClick={async () => await incrementCounter(index.key)}
                  className="border border-b-4 border-white bg-black px-10 py-3 text-2xl font-bold text-white hover:border-b"
                >
                  投票
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
