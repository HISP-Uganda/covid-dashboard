import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Case = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Case Coming Soon</div>;
});
