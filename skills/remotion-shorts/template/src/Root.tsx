import { Composition } from "remotion";
import { FPS } from "./content";
import { TOTAL, Video } from "./Video";

export const Root: React.FC = () => (
  <Composition id="Short" component={Video} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
