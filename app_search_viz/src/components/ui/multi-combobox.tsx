"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiComboboxProps {
  options: string[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  onAddNew?: (value: string) => void;
}

export function MultiCombobox({
  options,
  values,
  onValuesChange,
  placeholder = "Select options...",
  className,
  onAddNew,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const handleSelect = (selectedValue: string) => {
    if (values.includes(selectedValue)) {
      // Remove if already selected
      onValuesChange(values.filter((v) => v !== selectedValue));
    } else {
      // Add if not selected
      onValuesChange([...values, selectedValue]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue && !options.includes(inputValue)) {
      if (onAddNew) {
        onAddNew(inputValue);
        onValuesChange([...values, inputValue]);
        setInputValue("");
        setOpen(false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-mono uppercase h-14 text-lg border-2 border-border focus:ring-0 focus:border-primary min-h-[56px]",
            className
          )}
        >
          <span className="text-muted-foreground">
            {values.length > 0
              ? `${values.length} ticker${
                  values.length > 1 ? "s" : ""
                } selected`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search or add new ticker..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
            className="font-mono uppercase"
          />
          <CommandList>
            <CommandEmpty>
              {inputValue && !options.includes(inputValue) ? (
                <div className="p-2">
                  <Button
                    variant="outline"
                    className="w-full font-mono uppercase"
                    onClick={() => {
                      if (onAddNew) {
                        onAddNew(inputValue);
                        onValuesChange([...values, inputValue]);
                        setInputValue("");
                        setOpen(false);
                      }
                    }}
                  >
                    Add "{inputValue}"
                  </Button>
                </div>
              ) : (
                "No tickers found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                  className="font-mono uppercase"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
