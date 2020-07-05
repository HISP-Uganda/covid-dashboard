import { flatten, fromPairs, range, reduce } from 'lodash';
import { action, computed, observable } from "mobx";
import { generateUid } from "../utils/uid";



function sum(numbers: number[]) {
  return reduce(numbers, (a, b) => a + b, 0);
}

function average(numbers: number[]) {
  return sum(numbers) / (numbers.length || 1);
}

export class Visualization {
  @observable height: number = 0;
  @observable width: number = 0;
  @observable x: number = 0;
  @observable y: number = 0;
  @observable w: number = 1;
  @observable h: number = 1;
  @observable i: string = generateUid();
  @observable d2: any;
  @observable type: string = "chart";
  @observable chartType: string = "column";
  @observable data: any;
  @observable title: string = "";
  @observable subtitle: string = "";
  @observable xAxis: string = "";
  @observable yAxis: string = "";
  @observable loading: boolean = false;
  @observable cssClass = "";
  @observable labelClassName = "";
  @observable chartBackground: string = '';
  @observable editable: boolean = process.env.NODE_ENV === "development";

  @observable dx: any = {};
  @observable periods: string[] = [];
  @observable ou: string[] = [];
  @observable filterByOus: boolean = true;
  @observable filterByPeriods: boolean = true;
  @observable geoJson: any;
  @observable metadata: any = {}
  @observable orgUnitGroups: string[] = [];
  @observable movingAverage: boolean = false;

  @action setLoading = (val: boolean) => (this.loading = val);
  @action setDx = (dx: any[]) => (this.dx = dx);
  @action setOu = (ou: string[]) => (this.ou = ou);
  @action setPeriods = (periods: string[]) => (this.periods = periods);
  @action setFilterByOus = (val: boolean) => (this.filterByOus = val);
  @action setFilterByPeriods = (val: boolean) => (this.filterByPeriods = val);
  @action setChartType = (val: string) => (this.chartType = val);
  @action setType = (val: string) => (this.type = val);
  @action setData = (val: any) => (this.data = val);
  @action setTitle = (val: string) => (this.title = val);
  @action setSubtitle = (val: string) => (this.subtitle = val);
  @action setXAxis = (val: string) => (this.xAxis = val);
  @action setD2 = (val: any) => (this.d2 = val);
  @action setCssClass = (val: any) => (this.cssClass = val);
  @action setLabelClassName = (val: any) => (this.labelClassName = val);
  @action setMetadata = (val: any) => (this.metadata = val);
  @action setOrgUnitGroups = (val: any) => this.orgUnitGroups = val;
  @action changeChartBackground = (val: any) => this.chartBackground = val;
  @action setDimension = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  };

  @action loadOrgUnitGroups = async () => {
    const api = this.d2.Api.getApi();
    const { organisationUnitGroups } = await api.get(`organisationUnitGroups.json`, {
      fields: "organisationUnits",
      filter: `id:in:[${this.orgUnitGroups.join(',')}]`
    });
    const units = organisationUnitGroups.map(({ organisationUnits }: any) => {
      return organisationUnits.map((ou: any) => ou.id)
    });
    this.setOu(flatten(units));
  }
  @action setCoordinates = (x: number, y: number, w: number, h: number) => {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  };
  @action fetchFromAnalytics = async (loading: boolean = true) => {
    if (this.orgUnitGroups.length > 0) {
      await this.loadOrgUnitGroups();
    }
    if (loading) {
      this.setLoading(true);
    }
    if (this.dx.length > 0 && this.periods.length > 0 && this.ou.length > 0) {
      const realDimensions = this.dx.map((d: any) => {
        const child = d.child ? [d.child.dx] : [];
        return [d.dx, ...child]
      })
      let req = new this.d2.analytics.request()
        .withSkipData(false)
        .addDataDimension(flatten(realDimensions))
        // .withAggregationType("SUM")
        .withSkipRounding(true);
      if (this.filterByOus) {
        req = req.addOrgUnitFilter(this.ou);
      } else {
        req = req.addOrgUnitDimension(this.ou);
      }
      if (this.filterByPeriods) {
        req = req.addPeriodFilter(this.periods);
      } else {
        req = req.addPeriodDimension(this.periods);
      }
      const data = await this.d2.analytics.aggregate.get(req);
      if (this.orgUnitGroups.length > 0) {
      }
      this.setData(data);
    }
    if (loading) {
      this.setLoading(false);
    }
  };

  @action fetchGeoJson = async (unit: string) => {
    if (unit) {
      const api = this.d2.Api.getApi();
      const { organisationUnits } = await api.get(`organisationUnits`, {
        level: 3,
        paging: false,
        fields: "id,name,geometry",
      });

      const features = organisationUnits
        .map((child: any) => {
          if (!child.geometry || child.geometry.type === "Point") {
            return null;
          }
          return {
            properties: {
              id: child.id,
              name: child.name,
            },
            type: "Feature",
            geometry: child.geometry,
          };
        })
        .filter((x: any) => {
          return !!x;
        });

      this.geoJson = {
        type: "FeatureCollection",
        features,
      };
      this.setOu(organisationUnits.map((c: any) => c.id));
      this.filterByOus = false;
    }
  };

  @action fetchUnitsAndData = async (unit: string) => {
    this.setLoading(true);
    await this.fetchGeoJson(unit);
    await this.fetchFromAnalytics(false);
    this.setLoading(false);
  };

  @action changeDxClass = (object: any = {}) => {
    const tsDx = this.dx.map(({ child: c, ...d }: any) => {

      const current = object[d.dx];

      if (current) {
        const { child, ...rest }: any = current
        if (child) {
          c = { ...c, ...child }
        }
        return { ...d, ...rest, child: c }
      }

      return d;
    });
    this.setDx(tsDx);
  }

  @computed
  get chart() {
    if (this.type === "chart") {
      let xAxis = {};
      let series: any[] = [];

      let fullChart: any = {
        credits: { enabled: false },
        title: {
          text: `<span style="font-size: 20px;font-weight:bolder">${this.title}</span>`,
        },
        subtitle: {
          text: `<span>${this.subtitle}</span>`,
        },
        colors: ['#7798BF', 'orangered'],
        legend: {
          backgroundColor: '#EBEFF9'
        },

      };
      let colorAxis = {};
      let chart: any = {
        height: this.height,
        width: this.width,
        backgroundColor: this.chartBackground
      };
      let plotOptions = {};
      let tooltip: any = {};
      if (this.chartType === "column" && this.data) {
        chart = { ...chart, type: this.chartType };
        let categories: any[] = [];
        if (!this.filterByOus) {
          categories = this.data.metaData.dimensions.ou.map((p: string) => {
            return this.data.metaData.items[p].name;
          });
        } else {
          categories = this.data.metaData.dimensions.pe.map((p: string) => {
            return this.data.metaData.items[p].name;
          });
        }

        series = this.dx.map((d: any) => {
          let data;
          if (!this.filterByOus) {
            data = this.data.metaData.dimensions.ou.map((p: string) => {
              const dy = this.data.rows.find((r: any[]) => {
                return d.dx === r[0] && p === r[1];
              });
              if (dy) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
          } else {
            data = this.data.metaData.dimensions.pe.map((p: string, index: number) => {
              const dy = this.data.rows.find((r: any[]) => {
                return d.dx === r[0] && p === r[1];
              });
              if (dy) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
          }

          let result: any = { name: d.label, data }
          if (d.color) {
            result = { ...result, color: d.color }
          }
          return result;
        });

        xAxis = {
          categories,
          crosshair: true,
          labels: {
            style: {
              color: 'white'
            }
          }
        };
        fullChart = {
          ...fullChart,
          chart,
          plotOptions,
          tooltip,
          xAxis,
          yAxis: [{ // Primary yAxis
            labels: {
              format: '{value}',
              style: {
                color: 'white'
              }
            },
            title: {
              text: 'Number',
              style: {
                color: 'white'
              }
            }
          }],
          series,
        };
      } else if (["line", "spline"].indexOf(this.chartType) !== -1 && this.data) {
        let categories: any[] = [];
        chart = { ...chart, type: this.chartType };
        if (!this.filterByPeriods) {
          categories = this.data.metaData.dimensions.pe.map((p: string) => {
            return this.data.metaData.items[p].name;
          });

          series = this.dx.map((d: any) => {
            const data = this.data.metaData.dimensions.pe.map((p: string, index: number) => {
              let dy = [];
              if (d.movingAverage) {
                if (index >= 7) {
                  const numbers = range(index, index - 7, -1).map((val: number) => {
                    const period = this.data.metaData.dimensions.pe[val]
                    const dt = this.data.rows.find((r: any[]) => {
                      return d.dx === r[0] && period === r[1];
                    });

                    if (dt) {
                      return dt[2]
                    }
                    return 0
                  });
                  dy = [d.dx, p, average(numbers)]
                } else {
                  dy = [d.dx, p, 0]
                }
              } else {
                dy = this.data.rows.find((r: any[]) => {
                  return d.dx === r[0] && p === r[1];
                });
              }
              if (dy && dy.length > 0) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
            let result: any = { name: d.label, data }

            if (d.color) {
              result = { ...result, color: d.color }
            }

            return result;
          });
        }

        xAxis = {
          categories,
          crosshair: true,
          labels: {
            style: {
              color: 'white'
            }
          }
        };

        fullChart = {
          ...fullChart,

          chart,

          plotOptions,
          tooltip,
          xAxis,
          series,
        };
      } else if (this.geoJson && this.chartType === "map") {
        chart = {
          ...chart,
          map: this.geoJson,
        };

        colorAxis = {
          tickPixelInterval: 100,
          minColor: '#FFF5F5',
          maxColor: '#FF0000',
        };

        let realData = []

        if (this.data) {
          realData = this.data.rows.map((r: any) => {
            return [r[1], Number(r[2])];
          });
        }

        series = [
          {
            data: realData,
            keys: ["id", "value"],
            joinBy: "id",
            name: this.title,
            states: {
              hover: {
                color: "#a4edba",
              },
            },
            dataLabels: {
              enabled: true,
              format: "{point.value}",
            },
          },
        ];

        fullChart = {
          ...fullChart,
          chart,
          series,
          colorAxis,
        };
      }
      return fullChart;
    } else if (this.type === "multiple") {

      if (this.data) {
        let categories: any[] = [];
        if (!this.filterByOus) {
          categories = this.data.metaData.dimensions.ou.map((p: string) => {
            return this.data.metaData.items[p].name;
          });
        } else {
          categories = this.data.metaData.dimensions.pe.map((p: string) => {
            return this.data.metaData.items[p].name;
          });
        }

        const series = this.dx.map((d: any) => {
          let data;
          if (!this.filterByOus) {
            data = this.data.metaData.dimensions.ou.map((p: string) => {
              const dy = this.data.rows.find((r: any[]) => {
                return d.dx === r[0] && p === r[1];
              });
              if (dy) {
                return Number(dy[2]);
              } else {
                return 0;
              }
            });
          } else {
            data = this.data.metaData.dimensions.pe.map((p: string, index: number) => {
              let dy = [];
              if (d.movingAverage) {
                if (index >= 7) {
                  const numbers = range(index, index - 7, -1).map((val: number) => {
                    const period = this.data.metaData.dimensions.pe[val];
                    const dt = this.data.rows.find((r: any[]) => {
                      return d.dx === r[0] && period === r[1];
                    });

                    if (dt) {
                      return Number(dt[2]);
                    }
                    return 0
                  });
                  dy = [d.dx, p, average(numbers)]
                } else {
                  dy = [d.dx, p, 0]
                }
              } else {
                dy = this.data.rows.find((r: any[]) => {
                  return d.dx === r[0] && p === r[1];
                });
              }
              if (dy && dy.length > 0) {
                return Number(dy[2]);
              } else {
                return 0;
              }

              // const dy = this.data.rows.find((r: any[]) => {
              //   return d.dx === r[0] && p === r[1];
              // });
              // if (dy) {
              //   return Number(dy[2]);
              // } else {
              //   return 0;
              // }
            });
          }
          let result: any = {
            name: d.label,
            data,
            type: d.type
          }

          if (d.yAxis) {
            result = { ...result, yAxis: d.yAxis }
          }
          if (d.color) {
            result = { ...result, color: d.color }
          }

          if (d.lineWidth) {
            result = { ...result, lineWidth: d.lineWidth }
          }
          return result;
        });

        return {
          title: {
            text: `<span style="font-size: 16px;font-weight:bolder;color:white; ">${this.title}</span>`,
          },
          chart: {
            zoomType: 'xy',
            height: this.height,
            width: this.width,
            backgroundColor: this.chartBackground
          },
          xAxis: [{
            categories,
            crosshair: true,
            labels: {
              style: {
                color: 'white'
              }
            }
          }],
          credits: { enabled: false },
          plotOptions: {
            series: {
              pointPadding: 0,
              groupPadding: 0,
              borderWidth: 0
            }
          },
          yAxis: [{ // Primary yAxis
            labels: {
              format: '{value}',
              style: {
                color: this.dx[0].color
              }
            },
            title: {
              text: 'Number',
              style: {
                color: this.dx[0].color
              }
            }
          }, { // Secondary yAxis
            title: {
              text: this.dx[this.dx.length - 1].label,
              style: {
                color: this.dx[this.dx.length - 1].color
              }
            },
            labels: {
              format: '{value}',
              style: {
                color: this.dx[this.dx.length - 1].color
              }
            },
            opposite: true
          }],
          tooltip: {
            shared: true
          },
          legend: {
            backgroundColor: '#EBEFF9'
          },
          series
        }
      }
    } else if (this.type === "textValues") {
      if (this.data && this.dx.length > 0) {
        const dxes = this.dx.map((d: any, i: number) => {
          const searchedNum = this.data.rows.find((row: any) => {
            return row[0] === d.dx;
          });

          let child: any = null;

          if (d.child) {
            const childValue = this.data.rows.find((row: any) => {
              return row[0] === d.child.dx;
            });

            child = {
              label: d.child.label,
              value: childValue ? Number(Number(childValue[1]).toFixed(1)).toLocaleString() : '0',
              chart: d.child.chart,
              strokeWidth: d.child.strokeWidth,
              otherText: d.child.otherText,
              trailColor: d.child.trailColor,
              textColor: d.child.textColor,
              strokeColor: d.child.strokeColor,
              className: d.child.className,
              labelClassName: d.child.labelClassName,
              removePercentage: d.child.removePercentage
            }
          }

          return [d.dx, {
            label: d.label,
            dx: d.dx,
            showInfo: d.showInfo,
            strokeWidth: d.strokeWidth,
            textColor: d.textColor,
            trailColor: d.trailColor,
            strokeColor: d.strokeColor,
            otherText: d.otherText,
            className: d.className,
            labelClassName: d.labelClassName,
            value: searchedNum ? Number(Number(searchedNum[1]).toFixed(1)).toLocaleString() : '0',
            chart: d.chart,
            child,
            removePercentage: d.removePercentage
          }]
        });
        return fromPairs(dxes);
      }
    }
    return this.data;
  }
}

export const Item = new Visualization();
export type TItem = typeof Item;
