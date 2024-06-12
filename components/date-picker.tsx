import React from "react";

import { format } from "date-fns";

import { ptBR } from "date-fns/locale";

import { Calendar as CalendarIcon } from "lucide-react";

import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? (
            format(value, "PPP", { locale: ptBR })
          ) : (
            <span>Escolha uma data</span>
          )}
        </Button>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
};
