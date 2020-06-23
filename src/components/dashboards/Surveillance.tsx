import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";

export const Surveillance = observer(() => {
  const store = useStore();

  useEffect(() => { }, [store]);

  return <div>Coming Soon</div>;
});
