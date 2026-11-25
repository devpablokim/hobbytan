import { Composition } from "remotion";
import { HobbyTANIntro } from "./HobbyTANIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HobbyTANIntro"
        component={HobbyTANIntro}
        durationInFrames={30 * 90} // 90 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
