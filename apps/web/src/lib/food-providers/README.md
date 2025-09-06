# Multi-API Food Provider System

This system enables searching and importing foods from multiple nutrition databases with unified pagination and intelligent deduplication.

## Quick Setup

1. **Add FDC API Key** (Optional - enables USDA database access):

   ```bash
   # Add to .env.local
   FDC_API_KEY=your_api_key_here
   ```

   Get your free API key at: https://fdc.nal.usda.gov/api-key-signup

2. **Use in Components**:

   ```typescript
   import useEnhancedFoods from "@/hooks/useEnhancedFoods";

   const { foods, isLoading } = useEnhancedFoods({
     search: "chicken breast",
     enableDeduplication: true,
   });
   ```

## Features

### 🔍 **Unified Search**

- Search across your personal food database and USDA Food Data Central
- Intelligent deduplication removes similar foods from different sources
- Unified pagination works seamlessly across different API types

### 🏷️ **Source Identification**

- Visual badges show where each food comes from
- "Personal" for your custom foods
- "USDA" for official nutrition data

### 💾 **Import External Foods**

- Save external foods to your personal database
- Preserves original source metadata
- One-click import from search results

### ⚙️ **Flexible Configuration**

- Toggle providers on/off
- Configure merge strategies (priority, interleave, source groups)
- Adjust deduplication sensitivity
- Set custom rate limits and caching

## Architecture

### Provider System

- **InternalFoodProvider**: Your Supabase database
- **FDCFoodProvider**: USDA Food Data Central API
- **BaseFoodProvider**: Abstract base for adding new APIs

### Data Flow

```
Search Query → FoodAggregatorService → Multiple Providers → Unified Results
```

### Response Transformation

Each provider transforms its API response to the standard `EnhancedFood` format:

```typescript
{
  // Nutrition data
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // Source metadata
  source: FoodSourceType;
  external_id?: string;
  provider_metadata?: Record<string, unknown>;
}
```

## Adding New Food APIs

1. **Create Provider Class**:

   ```typescript
   class MyFoodProvider extends BaseFoodProvider {
     protected transformToEnhancedFood(apiFood: any): EnhancedFood {
       // Transform API response to EnhancedFood format
     }

     async searchFoods(
       options: FoodSearchOptions
     ): Promise<FoodProviderResponse> {
       // Implement search logic
     }
   }
   ```

2. **Register Provider**:

   ```typescript
   // In food-aggregator-service.ts
   const myProvider = new MyFoodProvider(config);
   this.providers.set(FoodSourceType.MY_API, myProvider);
   ```

3. **Add Source Type**:
   ```typescript
   // In food-provider.ts
   export enum FoodSourceType {
     INTERNAL = "internal",
     FDC_USDA = "fdc_usda",
     MY_API = "my_api", // Add here
   }
   ```

## Components

### Enhanced Food List

Complete food search interface with provider filtering:

```typescript
import EnhancedFoodList from '@/components/food/EnhancedFoodList';

<EnhancedFoodList />
```

### Food Source Badge

Shows data source with tooltip:

```typescript
import FoodSourceBadge from '@/components/food/FoodSourceBadge';

<FoodSourceBadge source={FoodSourceType.FDC_USDA} />
```

### Enhanced Hook

React Query hook for multi-provider search:

```typescript
const {
  foods, // Unified food results
  isLoading, // Loading state
  stats, // Source breakdown statistics
  saveExternalFood, // Import external foods
  getProviderInfo, // Available/enabled providers
} = useEnhancedFoods({
  search: "apple",
  providers: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
  enableDeduplication: true,
});
```

## Existing Integration

Your existing `FoodList` component now includes:

- **Toggle Button**: Science icon to switch between basic/enhanced modes
- **Automatic Detection**: Only shows toggle when external APIs are available
- **Seamless UX**: Enhanced mode renders `EnhancedFoodList` component

No changes needed to existing code - the enhancement is opt-in!

## Error Handling

The system gracefully handles:

- **API Failures**: If one provider fails, others continue working
- **Rate Limits**: Built-in rate limiting for external APIs
- **Missing Keys**: Falls back to internal database only
- **Network Issues**: Cached results when possible

## Configuration Options

```typescript
const aggregator = getFoodAggregator({
  enabledProviders: [FoodSourceType.INTERNAL, FoodSourceType.FDC_USDA],
  mergeStrategy: "priority", // 'priority' | 'interleave' | 'source_groups'
  deduplication: {
    enabled: true,
    similarity_threshold: 0.85, // 0-1 scale
  },
  defaultPageSizes: {
    [FoodSourceType.INTERNAL]: 15,
    [FoodSourceType.FDC_USDA]: 10,
  },
  maxResults: 50,
});
```

## Performance

- **Concurrent Requests**: Providers searched simultaneously
- **Intelligent Caching**: Different TTL per provider type
- **Request Deduplication**: React Query prevents duplicate searches
- **Rate Limiting**: Respects API limits automatically

## Future Enhancements

The system is designed for easy extension:

- Add Spoonacular API for recipes
- Add Nutritionix for branded foods
- Add barcode scanning support
- Add nutrition label OCR
- Add meal planning integration
