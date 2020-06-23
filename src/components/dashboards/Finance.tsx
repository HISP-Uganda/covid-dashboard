import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Finance = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Finance Coming Soon</div>;
});
