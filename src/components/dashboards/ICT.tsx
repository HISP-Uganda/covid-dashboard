import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const ICT = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>ICT Coming Soon</div>;
});
