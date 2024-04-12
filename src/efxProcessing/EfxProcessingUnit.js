import ConnectLinesFilter from '../filters/ConnectLines';
import DistortFilter from '../filters/Distort';
import DotsFilter from '../filters/Dots';
import ExesFilter from '../filters/Exes';
import ExperimentalFilter from '../filters/Experimental';
import MoveFilter from '../filters/Move';
import RemoveLinesFilter from '../filters/RemoveLines';
import ShortenLinesFilter from '../filters/ShortenLine';
import SimplifyFilter from '../filters/Simplify';
import SmoothFilter from '../filters/Smooth';
import SplitLinesFilter from '../filters/SplitLines';
import SplitLinesRandomFilter from '../filters/SplitLinesRandom';
import WiggleFilter from '../filters/Wiggle';

const FILTERS = [
    MoveFilter,
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
