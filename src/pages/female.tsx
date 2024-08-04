import EmblaCarousel from "@/components/Carousel";
import { female as slides } from "@/data/players";
import { usePassball } from "@/stores/usePassball";
import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useFirestore, useFirestoreDocData } from "reactfire";

const Male = () => {
  const { female, setAnswered, choice, setChoice } = usePassball();
  const router = useRouter();
  const firestore = useFirestore();
  const ref = doc(firestore, "passball", "settings");
  const { status, data: settings } = useFirestoreDocData(ref);

  if (status !== "success")
    return (
      <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-5">
        Loading
      </div>
    );

  if (status === "success" && !settings.enabled)
    return (
      <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center justify-center text-center text-2xl font-bold text-white">
          Voting has not started yet!
          <br />
          投票还没开始!
        </div>
        <button
          onClick={async () => await router.push("/")}
          className="border border-b-4 border-white bg-black px-10 py-3 text-2xl font-bold text-white hover:border-b"
        >
          Back to main page
        </button>
      </div>
    );
  return female ? (
    <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center justify-center text-center text-3xl text-white">
        You have voted!
        <br />
        你已投票了!
        <br />
        <br />
        Your Vote 你的票
        <br />
        <p className="pt-5 text-3xl font-bold uppercase text-[#FDA500]">
          {choice.female.replaceAll("_", " ")}
        </p>
      </div>

      <button
        onClick={async () => await router.push("/")}
        className="border border-b-4 border-white bg-black px-10 py-3 text-2xl font-bold text-white hover:border-b"
      >
        Back to main page
      </button>
    </div>
  ) : (
    <div>
      <EmblaCarousel
        slides={slides}
        options={{ loop: true }}
        gender="female"
        setAnswered={setAnswered}
        setChoice={setChoice}
      />
      <div className="flex w-full animate-pulse flex-row items-center justify-between px-10 text-[5rem]">
        <p className="text-white">←</p>
        <p className="text-[3rem] text-white">Swipe</p>
        <p className="rotate-180 text-white">←</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={async () => await router.push("/")}
          className="border border-b-4 border-white bg-black px-10 py-3 text-2xl font-bold text-white hover:border-b"
        >
          Back to main page
        </button>
      </div>
    </div>
  );
};

export default Male;
