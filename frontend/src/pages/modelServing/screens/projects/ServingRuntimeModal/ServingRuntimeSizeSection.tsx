import * as React from 'react';
import {
  FormGroup,
  FormSection,
  NumberInput,
  Select,
  SelectOption,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { UpdateObjectAtPropAndValue } from '~/pages/projects/types';
import {
  CreatingServingRuntimeObject,
  ServingRuntimeSize,
} from '~/pages/modelServing/screens/types';
import useGPUSetting from '~/pages/notebookController/screens/server/useGPUSetting';
import { GpuSettingString } from '~/types';
import ServingRuntimeSizeExpandedField from './ServingRuntimeSizeExpandedField';

type ServingRuntimeSizeSectionProps = {
  data: CreatingServingRuntimeObject;
  setData: UpdateObjectAtPropAndValue<CreatingServingRuntimeObject>;
  sizes: ServingRuntimeSize[];
  gpuSetting: GpuSettingString;
};

const ServingRuntimeSizeSection: React.FC<ServingRuntimeSizeSectionProps> = ({
  data,
  setData,
  sizes,
  gpuSetting,
}) => {
  const [sizeDropdownOpen, setSizeDropdownOpen] = React.useState(false);
  const { available: gpuAvailable, count: gpuCount } = useGPUSetting(gpuSetting || 'hidden');

  const sizeCustom = [
    ...sizes,
    {
      name: 'Custom',
      resources: sizes[0].resources,
    },
  ];

  const sizeOptions = () =>
    sizeCustom.map((size) => {
      const name = size.name;
      const desc =
        name !== 'Custom'
          ? `Limits: ${size.resources.limits?.cpu || '??'} CPU, ` +
            `${size.resources.limits?.memory || '??'} Memory ` +
            `Requests: ${size.resources.requests?.cpu || '??'} CPU, ` +
            `${size.resources.requests?.memory || '??'} Memory`
          : '';
      return <SelectOption key={name} value={name} description={desc} />;
    });

  return (
    <FormSection title="Compute resources per replica">
      <FormGroup label="Model server size">
        <Stack hasGutter>
          <StackItem>
            <Select
              removeFindDomNode
              id="model-server-size-selection"
              isOpen={sizeDropdownOpen}
              placeholderText="Select a model server size"
              onToggle={(open) => setSizeDropdownOpen(open)}
              onSelect={(_, option) => {
                const valuesSelected = sizeCustom.find((element) => element.name === option);
                if (valuesSelected) {
                  setData('modelSize', valuesSelected);
                }
                setSizeDropdownOpen(false);
              }}
              selections={data.modelSize.name}
              menuAppendTo={() => document.body}
            >
              {sizeOptions()}
            </Select>
          </StackItem>
          {data.modelSize.name === 'Custom' && (
            <StackItem>
              <ServingRuntimeSizeExpandedField data={data} setData={setData} />
            </StackItem>
          )}
        </Stack>
      </FormGroup>
      {gpuAvailable && (
        <FormGroup label="Model server gpus">
          <NumberInput
            isDisabled={!gpuCount}
            value={data.gpus}
            widthChars={10}
            min={0}
            max={gpuCount}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const target = event.currentTarget;
              setData('gpus', parseInt(target.value) || 0);
            }}
            onMinus={() => setData('gpus', data.gpus - 1)}
            onPlus={() => setData('gpus', data.gpus + 1)}
          />
        </FormGroup>
      )}
    </FormSection>
  );
};

export default ServingRuntimeSizeSection;
