import MoveFilter from '../filters/Move';
import MultiplyFilter from '../filters/Multiply';
import SimplifyFilter from '../filters/Simplify';
import ExperimentalFilter from '../filters/Experimental';
import DotsFilter from '../filters/Dots';
import WiggleFilter from '../filters/Wiggle';
import DistortFilter from '../filters/Distort';
import SplitLinesFilter from '../filters/SplitLines';
import SplitLinesRandomFilter from '../filters/SplitLinesRandom';
import ExesFilter from '../filters/Exes';
import SmoothFilter from '../filters/Smooth';

const FILTERS = [
    MoveFilter,
    MultiplyFilter,
    DistortFilter,
    SplitLinesFilter,
    SplitLinesRandomFilter,
    ExesFilter,
    ExperimentalFilter,
    DotsFilter,
    WiggleFilter,
    SimplifyFilter,
    SmoothFilter
];

const EfxProcessingUnit = ({
    layerID,
    pointArrays,
    filters,
    globalSettings
}) => {
    const enabledFilters = filters.filter((f) => f.enabled === true);

    let filteredPointArrays = pointArrays;
    // loop over every filter, pass in settings, process lines
    enabledFilters.forEach((filterSettings) => {
        const { filterName } = filterSettings;
        const { filter } = FILTERS.find(
            (constantFilter) => constantFilter.name === filterName
        );

        if (filter) {
            filteredPointArrays = filter({
                globalSettings,
                filterSettings,
                pointArrays: filteredPointArrays
            });
        }
    });

    return [layerID, filteredPointArrays];
};

export default EfxProcessingUnit;
