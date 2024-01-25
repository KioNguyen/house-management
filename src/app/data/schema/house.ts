export interface House {
  house_number: string;
  price: number;
  block_number: string;
  land_number: string;
  house_type: string;
  model: string;
  status: string;
}

export interface CreateHouseDTO {
  data: {
    type: string;
    attributes: {
      house_number: string;
      block_number: string;
      land_number: string;
      model: string;
      house_type: string;
      price: number;
      status: string;
    };
  };
}

export interface PatchHouseDTO {
  data: {
    type: string;
    id: string;
    attributes: {
      house_number: string;
      block_number: string;
      land_number: string;
      model: string;
      house_type: string;
      price: number;
      status: string;
    };
  };
}
