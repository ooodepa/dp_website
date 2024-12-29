import OzonProductDto from './OzonProduct.dto';

export default interface NomenclatureDto {
  dp_id: string;
  dp_1cCode: string;
  dp_1cDescription: string;
  dp_1cIsFolder: boolean;
  dp_1cParentId: string;
  dp_seoTitle: string;
  dp_seoDescription: string;
  dp_seoKeywords: string;
  dp_seoUrlSegment: string;
  dp_textCharacteristics: string;
  dp_markdown: string;
  dp_photos: string;
  dp_photos360: string;
  dp_photoUrl: string;
  dp_wholesaleQuantity: number;
  dp_brand: string;
  dp_combinedName: string;
  dp_vendorIds: string;
  dp_ozonIds: string;
  dp_sortingIndex: number;
  dp_youtubeIds: string;
  dp_barcodes: string;
  dp_length: number;
  dp_width: number;
  dp_height: number;
  dp_weight: number;
  dp_cost: number;
  dp_currancy: string;
  dp_isHidden: boolean;
  dp_itemCategoryId: number;
}

export const emptyNomenclature: NomenclatureDto = {
  dp_id: '',
  dp_1cCode: '',
  dp_1cDescription: '',
  dp_1cIsFolder: true,
  dp_1cParentId: '',
  dp_seoTitle: '',
  dp_seoDescription: '',
  dp_seoKeywords: '',
  dp_seoUrlSegment: '',
  dp_textCharacteristics: '',
  dp_markdown: '',
  dp_photos: '',
  dp_photos360: '',
  dp_photoUrl: '',
  dp_wholesaleQuantity: 0,
  dp_brand: '',
  dp_combinedName: '',
  dp_vendorIds: '',
  dp_ozonIds: '',
  dp_sortingIndex: 0,
  dp_youtubeIds: '',
  dp_barcodes: '',
  dp_length: 0,
  dp_width: 0,
  dp_height: 0,
  dp_weight: 0,
  dp_cost: 0,
  dp_currancy: '',
  dp_isHidden: true,
  dp_itemCategoryId: 0,
};

export interface NomenclatureDto_withOzonProducts extends NomenclatureDto {
  ozonProducts: OzonProductDto[];
}

export const emptyNomenclature_withOzonProducts: NomenclatureDto_withOzonProducts =
  {
    ...emptyNomenclature,
    ozonProducts: [],
  };
