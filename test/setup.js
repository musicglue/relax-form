import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiImmutable from 'chai-immutable';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

chai.use(chaiImmutable);
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(dirtyChai);
