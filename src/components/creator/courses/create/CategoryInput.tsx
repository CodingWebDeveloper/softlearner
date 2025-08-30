import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { trpc } from "@/lib/trpc/client";
import { Category } from "@/lib/database/database.types";
import { useState } from "react";

interface CategoryInputProps {
  name: string;
}

const MAX_OPTIONS = 5;

const CategoryInput = ({ name }: CategoryInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const { setFieldValue, handleBlur } = useFormikContext();
  const [field, meta] = useField<string>(name);

  const {
    data: categories = [],
    isLoading,
    error,
  } = trpc.categories.getCategories.useQuery<Category[]>();

  if (error) return <div>Error loading categories</div>;

  // Always show first 10 items initially, then filter on search
  const getOptions = (inputValue: string) => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    return filtered.slice(0, MAX_OPTIONS);
  };

  return (
    <Autocomplete
      options={getOptions(inputValue)}
      loading={isLoading}
      value={categories.find((cat) => cat.id === field.value) || null}
      getOptionLabel={(option) => option.name}
      onChange={(_, newValue) =>
        setFieldValue(name, newValue ? newValue.id : "")
      }
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category"
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          name={name}
          onBlur={handleBlur}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      filterOptions={(x) => x}
    />
  );
};

export default CategoryInput;
