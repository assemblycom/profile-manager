import { Autocomplete, Chip } from '@mui/material';
import { StyledTextInput } from '../styled/StyledTextInput';
import { ClearOutlined, FiberManualRecord } from '@mui/icons-material';
import { getChipColors } from '@/utils/updateColor';

interface IMultiSelect<T extends object> {
  data: T[];
  nameField: (item: T) => string; // Function to extract the name from the item
  value: any;
  getSelectedValue: (value: any) => void;
  disabled: boolean;
}

export const MultiSelect = <T extends object>({ data, nameField, value, getSelectedValue, disabled }: IMultiSelect<T>) => {
  return (
    <Autocomplete
      onChange={(event: any, newValue: any) => {
        getSelectedValue(newValue);
      }}
      value={value}
      multiple
      id="tags-outlined"
      options={Array.isArray(data) ? data : []}
      getOptionLabel={(option: T) => nameField(option)}
      filterSelectedOptions
      autoHighlight
      disabled={disabled}
      renderInput={(params) => <StyledTextInput {...params} />}
      renderTags={(value: T[], getTagProps) =>
        value.map((option: any, index: number) => {
          const chipColors = getChipColors(option.color);
          return (
            <Chip
              variant="outlined"
              label={nameField(option)}
              {...getTagProps({ index })}
              key={index}
              deleteIcon={<ClearOutlined />}
              avatar={<FiberManualRecord fontSize="small" />}
              sx={{
                '&.MuiChip-root': {
                  borderColor: chipColors.border,
                  border: '2px solid',
                  background: chipColors.background,
                  color: chipColors.text,
                  fontWeight: 500,
                },
                '& .MuiChip-deleteIcon': {
                  color: chipColors.icon,
                },
                '& .MuiChip-avatar': {
                  color: chipColors.icon,
                },
              }}
            />
          );
        })
      }
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingTop: 1,
          paddingBottom: 1,
        },
      }}
    />
  );
};
