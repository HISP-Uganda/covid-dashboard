import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Community = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Community Coming Soon</div>;
});
