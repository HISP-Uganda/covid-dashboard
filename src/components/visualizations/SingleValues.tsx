import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { TextValue } from "./TextValue";
import { TItem } from "../../models/Visualization";
import { useStore } from "../../Context";
import { ProgressValue } from "./ProgressValue";

interface SingleValuesProps {
  element: TItem;
}

const getFormat = (vals: any) => {
  if (!vals.otherText) {
    return (percent: number | undefined) => percent + '%'
  }
  return (percent: number | undefined) => <div>
    <p>{vals.otherText}</p>
    <p>{percent}</p>
  </div>
}

export const SingleValues: FC<SingleValuesProps> = observer(({ element }) => {
  const store = useStore();

  useEffect(() => {
    element.setOu([store.selectedOrgUnit]);
    element.fetchFromAnalytics();
  }, [element, store.selectedOrgUnit]);

  if (element.loading) {
    return <div>Loading...</div>;
  }

  const display = (vals: any) => {
    switch (vals.chart) {
      case 'circle':
      case 'line':
        return <ProgressValue key={vals.dx} value={vals.value} chart={vals.chart} showInfo={vals.showInfo} otherText={vals.otherText} strokeWidth={vals.strokeWidth} stokeColor={vals.strokeColor} />
      case 'text':
        return vals.value
      case 'textValue':
        return <TextValue
          key={vals.dx}
          label={vals.label}
          value={vals.value}
          className={vals.className}
          otherText={vals.otherText}
        />
      default:
        return <TextValue
          key={vals.dx}
          label={vals.label}
          value={vals.value}
          className={vals.className}
          otherText={vals.otherText}
        />
    }
  }

  const displayAll = (vals: any) => {
    return vals.child ? <div key={vals.dx}>{display(vals)}{display(vals.child)}</div> : display(vals)
  }

  return (
    <>
      {Object.values(element.chart).map((value: any, i: number) => (
        displayAll(value)
      ))}
    </>
  );
});
