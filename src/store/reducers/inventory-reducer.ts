import {
  InventoryAction,
  InventoryState,
  InventoryTypes,
} from './inventory-reducer.dto';

const defaultStore: InventoryState = {
  inventory: [],
  items: [],
  isLoading: false,
  loadingStatus: '',
  isLoaded: false,
  error: null,
};

export function InventoryReducer(
  state = defaultStore,
  action: InventoryAction,
): InventoryState {
  switch (action.type) {
    case InventoryTypes.FETCH_INVENTORY:
      return {
        inventory: [],
        items: [],
        isLoading: false,
        loadingStatus: '',
        isLoaded: false,
        error: null,
      };
    case InventoryTypes.FETCH_INVENTORY_LOADING:
      return {
        inventory: [],
        items: [],
        isLoading: true,
        loadingStatus: action.payload,
        isLoaded: false,
        error: null,
      };
    case InventoryTypes.FETCH_INVENTORY_SUCCESS:
      return {
        inventory: action.payload.inventory.sort((a, b) =>
          a.dp_vendorId.localeCompare(b.dp_vendorId),
        ),
        items: action.payload.items,
        isLoading: false,
        loadingStatus: '',
        isLoaded: true,
        error: null,
      };
    case InventoryTypes.FETCH_INVENTORY_ERROR:
      return {
        inventory: [],
        items: [],
        isLoading: false,
        loadingStatus: '',
        isLoaded: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
