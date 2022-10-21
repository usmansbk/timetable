import {memo} from 'react';
import EmptyState from '~components/EmptyState';

function AgendaList() {
  return <EmptyState title="No Events" />;
}

export default memo(AgendaList);
