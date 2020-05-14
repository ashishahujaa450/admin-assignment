import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.loadScript();
  }

  //appending chart script on component level
  private loadScript() {
    let isFound = false;

    let scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; ++i) {
      if (
        scripts[i].getAttribute("src") != null &&
        scripts[i].getAttribute("src").includes("dashboard1")
      ) {
        document.getElementsByTagName("head")[0].removeChild(scripts[i]);
      }
    }

    if (!isFound) {
      let dynamicScripts = ["../assets/js/dashboard1.js"];
      for (let i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement("script");
        node.src = dynamicScripts[i];
        node.type = "text/javascript";
        node.async = false;
        node.charset = "utf-8";
        document.getElementsByTagName("head")[0].appendChild(node);
      }
    }
  }
}
