import * as React from 'react';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { DropdownDirection, Text, Title } from '@patternfly/react-core';
import ConnectedNotebookNames from '~/pages/projects/notebook/ConnectedNotebookNames';
import { ConnectedNotebookContext } from '~/pages/projects/notebook/useRelatedNotebooks';
import { DataConnection } from '~/pages/projects/types';
import ResourceNameTooltip from '~/pages/projects/components/ResourceNameTooltip';
import EmptyTableCellForAlignment from '~/pages/projects/components/EmptyTableCellForAlignment';
import {
  getDataConnectionDescription,
  getDataConnectionDisplayName,
  getDataConnectionProvider,
  getDataConnectionResourceName,
  getDataConnectionType,
} from './utils';

type DataConnectionsTableRowProps = {
  obj: DataConnection;
  onEditDataConnection: (pvc: DataConnection) => void;
  onDeleteDataConnection: (dataConnection: DataConnection) => void;
};

const DataConnectionsTableRow: React.FC<DataConnectionsTableRowProps> = ({
  obj,
  onEditDataConnection,
  onDeleteDataConnection,
}) => (
  <Tr>
    <EmptyTableCellForAlignment />
    <Td dataLabel="Name">
      <Title headingLevel="h4">
        <ResourceNameTooltip resource={obj.data}>
          {getDataConnectionDisplayName(obj)}
        </ResourceNameTooltip>
      </Title>
      <Text>{getDataConnectionDescription(obj)}</Text>
    </Td>
    <Td dataLabel="Type">{getDataConnectionType(obj)}</Td>
    <Td dataLabel="Connected workbenches">
      <ConnectedNotebookNames
        context={ConnectedNotebookContext.EXISTING_DATA_CONNECTION}
        relatedResourceName={getDataConnectionResourceName(obj)}
      />
    </Td>
    <Td dataLabel="Provider">{getDataConnectionProvider(obj)}</Td>
    <Td isActionCell>
      <ActionsColumn
        dropdownDirection={DropdownDirection.up}
        items={[
          {
            title: 'Edit data connection',
            onClick: () => {
              onEditDataConnection(obj);
            },
          },
          {
            title: 'Delete data connection',
            onClick: () => {
              onDeleteDataConnection(obj);
            },
          },
        ]}
      />
    </Td>
  </Tr>
);

export default DataConnectionsTableRow;
