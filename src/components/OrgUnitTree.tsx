import { TreeSelect } from "antd";
import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../Context";

export const OrgUnitTree = observer(() => {
  const store = useStore();

  const onLoadData = async (treeNode: any) => {
    await store.loadOrganisationUnitsChildren(treeNode.id);
  };

  return (
    <div className="headers">
      <div style={{ fontSize: 20, textAlign: "center" }}>EPi</div>
      <TreeSelect
        allowClear={true}
        treeDataSimpleMode
        size="large"
        style={{ width: "40%", marginLeft: "auto" }}
        value={store.selectedOrgUnit}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select health centre"
        onChange={store.setSelectedOrgUnit}
        loadData={onLoadData}
        treeData={store.organisationUnits}
      />{" "}
    </div>
  );
});
