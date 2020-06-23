import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Risk = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Risk Coming Soon</div>;
});
