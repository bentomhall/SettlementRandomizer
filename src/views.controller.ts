import { Controller, Get, Render } from "@nestjs/common";
import { CultureService } from "./culture/CultureService";
import { DataFileProvider, DataFileType } from "./shared/dbProvider";

@Controller()
export class ViewsController {
  constructor(private service: CultureService, private fileProvider: DataFileProvider)  {}

  @Get()
  @Render('index')
  async index(): Promise<any> {
    let allCultures = await this.service.findAllIdsAndNames();
    let js = await this.fileProvider.getData(DataFileType.FRONT_END_SCRIPT, false);
    return {
      cultures: allCultures.map(x => {
        return {
          id: x.id,
          name: x.name
        }
      }),
      script: js
    };
  }
}