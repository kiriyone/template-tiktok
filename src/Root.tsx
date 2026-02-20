import {Composition} from "remotion";
import {
  calculateOvertimeVlogMetadata,
  OvertimeVlogHorizontal,
  overtimeVlogSchema,
} from "./OvertimeVlogHorizontal";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OvertimeVlogHorizontal"
      component={OvertimeVlogHorizontal}
      calculateMetadata={calculateOvertimeVlogMetadata}
      schema={overtimeVlogSchema}
      width={1920}
      height={1080}
    />
  );
};
