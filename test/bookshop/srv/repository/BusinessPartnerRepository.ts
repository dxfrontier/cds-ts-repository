import { Repository } from '@dxfrontier/cds-ts-dispatcher';
import { BaseRepository } from '../../../../lib/index';
import { ExternalService } from '../../../../lib/index';

import { A_BusinessPartner } from '../../@cds-models/API_BUSINESS_PARTNER';

@Repository()
@ExternalService('API_BUSINESS_PARTNER')
class BusinessPartnerRepository extends BaseRepository<A_BusinessPartner> {
  constructor() {
    super(A_BusinessPartner);
  }
  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BusinessPartnerRepository;
