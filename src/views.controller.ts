import { Controller, Get, Render } from "@nestjs/common";
import { CultureService } from "./culture/CultureService";

@Controller()
export class ViewsController {
  constructor(private service: CultureService)  {}

  @Get()
  @Render('index')
  async index(): Promise<any> {
    let allCultures = await this.service.findAll();
    return {
      cultures: allCultures.map(x => {
        return {
          id: x.id,
          name: x.name
        }
      })
    };
  }
}