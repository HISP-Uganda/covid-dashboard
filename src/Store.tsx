import { observable, action, computed } from "mobx";
import { TItem, Visualization } from "./models/Visualization";
import { init } from "d2";
import { flatten } from "lodash";

class Store {
  @observable visualizations: TItem[] = [];
  @observable d2: any;
  @observable userOrgUnits: any = [];
  @observable selectedOrgUnit: any;

  @action setD2 = async (baseUrl: string, apiVersion: number) => {
    this.d2 = await init({
      appUrl: baseUrl,
      baseUrl: `${baseUrl}/api/${apiVersion}`,
    });
  };

  @action addAnalyticsItem = (
    x: number,
    y: number,
    w: number,
    h: number,
    dx: string[],
    periods: string[],
    type: string,
    title: string,
    subtitle: string,
    xAxis: string = "",
    chartType: string = "column",
    filterByOu: boolean = true,
    filterByPeriods: boolean = true
  ) => {
    const item = new Visualization();
    item.setD2(this.d2);
    item.setCoordinates(x, y, w, h);
    item.setDx(dx);
    item.setPeriods(periods);
    item.setFilterByOus(filterByOu);
    item.setFilterByPeriods(filterByPeriods);
    item.setType(type);
    item.setChartType(chartType);
    item.setXAxis(xAxis);
    item.setTitle(title);
    item.setSubtitle(subtitle);
    this.visualizations = [...this.visualizations, item];
  };

  @action addTextItem = (
    x: number,
    y: number,
    w: number,
    h: number,
    data: any
  ) => {
    const item = new Visualization();
    item.setType("plainText");
    item.setData(data);
    item.setCoordinates(x, y, w, h);
    item.setCssClass("");
    this.visualizations = [...this.visualizations, item];
  };

  @action addItem = (x: number, y: number, w: number, h: number) => {
    const item = new Visualization();
    item.setD2(this.d2);
    item.setCoordinates(x, y, w, h);
    this.visualizations = [...this.visualizations, item];
  };

  @action
  loadUserOrgUnits = async () => {
    try {
      const data = await this.d2.currentUser.getOrganisationUnits({
        paging: false,
        fields: `id,path,name,level,leaf,displayShortName~rename(displayName),children::isNotEmpty`,
      });
      this.userOrgUnits = data.toArray();
      this.selectedOrgUnit = this.userOrgUnits[0].id;
    } catch (e) {
      console.log(e);
    }
  };

  @action
  loadOrganisationUnitsChildren = async (parent: string) => {
    try {
      const api = this.d2.Api.getApi();
      const { organisationUnits } = await api.get("organisationUnits.json", {
        filter: `id:in:[${parent}]`,
        paging: "false",
        fields: "children[id,name,path,leaf]",
      });
      const found = organisationUnits.map((unit: any) => {
        return unit.children.map((child: any) => {
          return { ...child, pId: parent };
        });
      });
      const all = flatten(found);
      this.userOrgUnits = [...this.userOrgUnits, ...all];
    } catch (e) {
      console.log(e);
    }
  };

  @action setSelectedOrgUnit = (val: any) => {
    this.selectedOrgUnit = val;
  };

  @computed
  get organisationUnits() {
    const units = this.userOrgUnits.map((unit: any) => {
      return {
        id: unit.id,
        pId: unit.pId || "",
        value: unit.id,
        title: unit.name,
        isLeaf: unit.leaf,
      };
    });
    return units;
  }
}

export const store = new Store();
