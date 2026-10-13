import { Composition } from "remotion";
import { OneSentence, TOTAL } from "./OneSentence";

export const Root: React.FC = () => (
  <Composition
    id="OneSentence"
    component={OneSentence}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
