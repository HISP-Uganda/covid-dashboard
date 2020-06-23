import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Summary = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Summary Coming Soon</div>;
});
