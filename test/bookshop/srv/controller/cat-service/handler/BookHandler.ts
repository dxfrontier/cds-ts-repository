import BusinessPartnerRepository from '../../../repository/BusinessPartnerRepository';
import {
  AfterRead,
  CDS_DISPATCHER,
  EntityHandler,
  Inject,
  Req,
  Request,
  RequestResponse,
  Res,
  Results,
  Service,
} from '@dxfrontier/cds-ts-dispatcher';
import { Book } from '../../../../@cds-models/CatalogService';

@EntityHandler(Book)
class BookHandler {
  @Inject(CDS_DISPATCHER.SRV) private readonly srv: Service;

  @Inject(BusinessPartnerRepository) private readonly businessPartnerRepository: BusinessPartnerRepository;

  @AfterRead()
  private async afterRead(@Req() req: Request, @Results() results: Book[], @Res() res: RequestResponse): Promise<void> {
    const created = await this.businessPartnerRepository.create({
      BusinessPartner: '1404100',
      BusinessPartnerFullName: 'ABS Gmbh Software',
    });
    res.setHeader('create', String(created));

    // ################################################################################################################################################

    const createdMany = await this.businessPartnerRepository.createMany(
      {
        BusinessPartner: '1964100',
        BusinessPartnerFullName: 'Microsoft',
      },
      {
        BusinessPartner: '1804150',
        BusinessPartnerFullName: 'Apple',
      },
    );
    res.setHeader('createdMany', String(createdMany));

    // ################################################################################################################################################

    const paginate = await this.businessPartnerRepository.paginate({ limit: 1 });
    res.setHeader('paginate', paginate!.length);

    // ################################################################################################################################################

    const paginateWithSkip = await this.businessPartnerRepository.paginate({ limit: 1, skip: 1 });
    res.setHeader('paginateWithSkip', paginateWithSkip!.length);

    // ################################################################################################################################################

    const find = await this.businessPartnerRepository.find({ BusinessPartner: '1004155' });
    res.setHeader('find', find!.length);

    // ################################################################################################################################################

    const findOne = await this.businessPartnerRepository.findOne({ BusinessPartner: '1004155' });
    res.setHeader('findOne', String(findOne?.BusinessPartner));

    // ################################################################################################################################################

    const builderFind = await this.businessPartnerRepository
      .builder()
      .find({ BusinessPartner: '1004155' })
      .columns('BusinessPartner', 'BusinessPartnerFullName')
      .execute();
    res.setHeader('builderFind', builderFind!.length);

    // ################################################################################################################################################

    const deleted = await this.businessPartnerRepository.delete({ BusinessPartner: '1004155' });
    res.setHeader('deleted', String(deleted));

    // ################################################################################################################################################

    const deletedMany = await this.businessPartnerRepository.deleteMany({ BusinessPartner: '1964100' });
    res.setHeader('deletedMany', String(deletedMany));

    // ################################################################################################################################################

    const exists = await this.businessPartnerRepository.exists({ BusinessPartner: '1004155' });
    res.setHeader('exists', String(exists));

    // ################################################################################################################################################

    const count = await this.businessPartnerRepository.count();
    res.setHeader('count', count);

    // ################################################################################################################################################
  }
}

export default BookHandler;
