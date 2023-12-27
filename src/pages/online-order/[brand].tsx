import AppWrapper from '@/components/AppWrapper/AppWrapper';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import AppContainer from '@/components/AppContainer/AppContainer';
import TableAllBrandItem from '@/components/TableAllBrandItem/TableAllBrandItem';

export default function ViewAsTableBrandsPage() {
  return (
    <AppWrapper>
      <Breadcrumbs />
      <AppContainer>
        <TableAllBrandItem />
      </AppContainer>
    </AppWrapper>
  );
}
