import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../Context";
import { OrgUnitTree } from "../OrgUnitTree";
import { Dashboard } from "../Dashboard";

export const Treatment = observer(() => {
  const store = useStore();

  useEffect(() => {}, [store]);

  return <Dashboard />;
});
