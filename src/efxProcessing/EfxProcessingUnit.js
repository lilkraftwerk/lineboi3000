import MoveFilter from '../filters/Move';
import MultiplyFilter from '../filters/Multiply';
import SimplifyFilter from '../filters/Simplify';
import ExperimentalFilter from '../filters/Experimental';
import ConnectLinesFilter from '../filters/ConnectLines';
import DotsFilter from '../filters/Dots';
import WiggleFilter from '../filters/Wiggle';
import DistortFilter from '../filters/Distort';
import RemoveLinesFilter from '../filters/RemoveLines';
import ShortenLinesFilter from '../filters/ShortenLine';
import SplitLinesFilter from '../filters/SplitLines';
import SplitLinesRandomFilter from '../filters/SplitLinesRandom';
import ExesFilter from '../filters/Exes';
import SmoothFilter from '../filters/Smooth';

const FILTERS = [
    MoveFilter,
    MultiplyFilter,
    DistortFilter,
    RemoveLinesFilter,
    ShortenLinesFilter,
    SplitLinesFilter,
    SplitLinesRandomFilter,
    ExesFilter,
    ConnectLinesFilter,
    ExperimentalFilter,
    DotsFilter,
    ConnectLinesFilter,
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
